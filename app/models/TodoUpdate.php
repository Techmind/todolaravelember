<?php

class TodoUpdate {
    const AUTOINC_ID_KEY = 'auo_inc_update_queue';
    const QUEUE_PREFIX = 'update_queue_';
    const ALIVE_QUEUES = 'cleanup_queues';
    const EXPIRE_ID = 'still_alive_';
    const QUEUE_TTL = 120;

    /**
     * @var Predis\Client $redis
     */
    private $redis = null;

    public function __construct()
    {
        // work around to not use extension on pagodabox
        $this->redis = RedisL4::connection();
    }

    public function getQueueId()
    {
        $id = $this->redis->incr(self::AUTOINC_ID_KEY);
        $res = $this->redis->hset(self::ALIVE_QUEUES, $id, 1) &&
               $this->redis->set(self::EXPIRE_ID . $id, 1) &&
               $this->markQueueAlive($id);
        return $res ? $id : false;
    }

    /**
     * @param $id
     * @param int $timeout default 20, less than default php`s - 30
     */
    public function listen($id, $timeout = 20) {
        $all = [];
        $any = $this->redis->blpop(self::QUEUE_PREFIX . $id, $timeout);
        while ($any) {
            $all[] = unserialize($any[1]);
            $any = $this->redis->lpop(self::QUEUE_PREFIX . $id);
        }

        $this->markQueueAlive($id);

        return $all;
    }

    public function publish($cmd, $todo_id, $ignored_channel) {
        $ids = $this->redis->hkeys(self::ALIVE_QUEUES);

        $res = true;
        foreach ($ids as $id) {
            if ($id != $ignored_channel) {
                $res = $this->redis->lpush(self::QUEUE_PREFIX . $id, serialize(array($cmd, $todo_id))) && $res;
            }
        }

        return $res;
    }

    private function markQueueAlive($id) {
        return $this->redis->expire(self::EXPIRE_ID . $id, self::QUEUE_TTL);
    }

    public function cleanup()
    {
        // get all still alive queues
        $ids = $this->redis->hkeys(self::ALIVE_QUEUES);

        foreach ($ids as $id) {
            $get = $this->redis->get(self::EXPIRE_ID . $id);
            if (!$get) {
                // mark queues as dead
                $this->redis->hdel(self::ALIVE_QUEUES, $id);
                // del queue if still alive
                $this->redis->del(self::QUEUE_PREFIX . $id);
            }
        }
    }
}
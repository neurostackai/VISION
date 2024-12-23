interface TwitterActivity {
    type: string;
    username: string;
    user_id: string;
    mention_id: string;
  }
  
  interface ActivityResponse {
    data: {
      activity: TwitterActivity[];
      lastTime: string;
    }
  }
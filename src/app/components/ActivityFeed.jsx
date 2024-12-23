import { useEffect, useState } from "react";

const getActivities = async (lastTimestamp) => {
  try {
    const response = await fetch("/api/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lastTimestamp }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getActivities:", error);
    return { data: { activity: [], lastTime: null } }; 
  }
};

const ActivityFeed = () => {
  const [feedContent, setFeedContent] = useState([]);
  const [lastTimestamp, setLastTimestamp] = useState(null);

  const fetchActivities = async () => {
    try {
      const activitiesResponse = await getActivities(lastTimestamp);
      if (activitiesResponse.data.activity.length > 0) {
        setLastTimestamp(activitiesResponse.data.lastTime);

        const activities = activitiesResponse.data.activity.filter(
          (activity) =>
            activity.type === "INTERACTION" &&
            activity.username !== "OracleZordon"
        );

        const newFeedContent = [...feedContent];

        for (const activity of activities) {
          const waiting = Math.floor(Math.random() * 3000) + 500;

          const userId = activity.user_id && activity.mention_id
            ? activity.user_id
            : "1034147061711679488";
          const mentionId = activity.mention_id || "1375152598945312768";

          const tweetUrl = `https://twitter.com/${userId}/status/${mentionId}`;

          if (newFeedContent.length > 3) {
            newFeedContent.shift();
          }

          newFeedContent.push(
            `<blockquote class="twitter-tweet" data-lang="en">
              <p lang="en" dir="ltr"></p><a href="${tweetUrl}"></a>
            </blockquote>`
          );

          setFeedContent([...newFeedContent]);

          await new Promise((r) => setTimeout(r, waiting));
        }
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

 
  useEffect(() => {
    const interval = setInterval(() => {
      fetchActivities();
    }, 10000); 

    return () => clearInterval(interval);
  }, [lastTimestamp, feedContent]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [feedContent]);

  return (
    <div id="x-activity">
      <div
        dangerouslySetInnerHTML={{ __html: feedContent.join("") }}
      ></div>
    </div>
  );
};

export default ActivityFeed;

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { lastTimestamp } = req.body;
        const activities = [
            {
                type: "INTERACTION",
                username: "user1",
                user_id: "123456",
                mention_id: "78910",
            },
            {
                type: "INTERACTION",
                username: "user2",
                user_id: "234567",
                mention_id: "89011",
            },
        ];

        const filteredActivities = activities.filter(
            (activity) => Date.now() - lastTimestamp < 10000
        );

        res.status(200).json({
            data: {
                activity: filteredActivities,
                lastTime: Date.now(),
            },
        });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

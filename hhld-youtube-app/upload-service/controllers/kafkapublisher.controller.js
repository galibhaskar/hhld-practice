import KafkaConfig from "../kafka/kafka.js";

const sendMessageToKafka = async (req, res) => {
  console.log("request for publishing message to kafka");

  try {
    let { message } = req.body;

    console.log("message:", message);

    const kafkaConfigInstance = new KafkaConfig();

    const msgs = [
      {
        key: "key1",
        value: JSON.stringify(message),
      },
    ];

    const response = await kafkaConfigInstance.produce("transcode", msgs);

    console.log("result of produce:", response);

    res.status(200).send("message published to kafka");
  } catch (error) {
    console.log("error at send message to kafka", error);

    res.status(500).send("error publishing the message to kafka", error);
  }
};

export default sendMessageToKafka;

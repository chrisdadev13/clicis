import axios from "axios";

type Response = {
  available: boolean;
  premium: boolean;
  suggestedUsername: string;
};

export default async function validateCalUsername(
  username: string,
): Promise<Response | undefined> {
  const data = JSON.stringify({
    username,
  });

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://app.cal.com/api/username",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const result = await axios.request(config);

  return result.data as Response;
}

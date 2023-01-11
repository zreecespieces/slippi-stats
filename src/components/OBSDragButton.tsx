import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

interface OBSLayerOptions {
  "layer-name": string;
  "layer-width": number;
  "layer-height": number;
}

function generateLink(options?: Partial<OBSLayerOptions>): string {
  let location = window.location.href;
  for (const [key, val] of Object.entries(options || {})) {
    location += `&${key}=${val}`;
  }
  return location;
}

export const OBSDragButton: React.FC<{ options?: Partial<OBSLayerOptions> }> = (props) => {
  const link = "https://vince.id.au/slippi-stats" + generateLink(props.options).split(":3000")[1];
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchShortLink = async () => {
      const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer d1dbcf6693e0c2b1d50b655d7047b3c85a4bd0e2",
        },
        body: JSON.stringify({
          domain: "bit.ly",
          long_url: link,
        }),
      });
      const { link: shortUrl } = await response.json();
      setImage(
        `https://api.apiflash.com/v1/urltoimage?access_key=965cc8618cef42b9a6d790639d9acd45&url=${shortUrl}&quality=100&format=jpeg&response_type=image&wait_until=dom_loaded`
      );
    };

    fetchShortLink();
  }, [link]);

  async function downloadImage(imageSrc: string) {
    const image = await fetch(imageSrc);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "stats";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return <button onClick={() => downloadImage(image || "")}>Update Stats Image</button>;
};

import { ImageResponse } from "next/server"

export const contentType = "image/png"
export const runtime = "edge"
export const size = {
    width: 32,
    height: 32,
}

let font: ArrayBuffer

export default async function icon() {
    if (!font) {
        font = await fetch(new URL("../assets/fonts/Roie.ttf", import.meta.url)).then((res) => res.arrayBuffer())
    }

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 18,
                    background: "#030711",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e1e7ef",
                    fontFamily: "Roie",
                    fontWeight: "normal",
                    borderRadius: "6px",
                }}
            >
                R
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: "Roie",
                    data: font,
                    weight: 400,
                    style: "normal",
                },
            ],
        }
    )
}

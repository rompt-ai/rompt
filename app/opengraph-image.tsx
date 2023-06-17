import { ImageResponse } from "next/server"

export const alt = "Rompt.ai"
export const runtime = "edge"
export const contentType = "image/png"
export const size = {
    width: 1200,
    height: 630,
}

let font: ArrayBuffer

export default async function og() {
    if (!font) {
        font = await fetch(new URL("../assets/fonts/Roie.ttf", import.meta.url)).then((res) => res.arrayBuffer())
    }
    const textColor = "#e1e7ef"

    return new ImageResponse(
        (
            <div
                tw='flex relative flex-col p-12 w-full h-full items-start'
                style={{
                    color: textColor,
                    background: "linear-gradient(90deg, #030711 0%, #0f1629 100%)",
                }}
            >
                <div tw='flex flex-col flex-1 py-10'>
                    <div tw='flex text-xl uppercase font-bold tracking-tight' style={{ fontFamily: "Roie", fontWeight: "normal" }}>
                        Massive experimenting and A/B testing
                    </div>
                    <div
                        tw='flex leading-[1.1] text-[80px] font-bold'
                        style={{
                            fontFamily: "Roie",
                            fontWeight: "bold",
                            marginLeft: "-3px",
                            fontSize: "95px",
                        }}
                    >
                        Rompt.ai
                    </div>
                </div>
                <div tw='flex items-center w-full justify-between'>
                    {/* <div tw='flex text-xl' style={{ fontFamily: "Roie", fontWeight: "normal" }}>
                            tx.shadcn.com
                        </div> */}
                    <div />
                    <div tw='flex items-center text-xl' style={{ fontFamily: "Roie", fontWeight: "normal" }}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke={textColor}
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                        >
                            <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'></path>
                        </svg>
                        <div tw='flex ml-2'>github.com/rompt-ai/rompt</div>
                    </div>
                </div>
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
                {
                    name: "Roie",
                    data: font,
                    weight: 700,
                    style: "normal",
                },
            ],
        }
    )
}

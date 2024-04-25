import React from 'react'
import ReactDOMServer from 'react-dom/server'
import dateFormat from 'dateformat';
import { PiNoteFill } from "react-icons/pi";

// const stickyNoteBase64 = 'data:image/png;base64,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';

export default function svgConvertUrl(title,owner,createdAt, userId) {
    const svg = (
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="150">
            <rect x="0" y="0" width="100%" height="100%" fill="#F8FAFB" />
            {/* <rect x="0" y="0" width="100%" height="100%" fill="#111111" /> */}
            <foreignObject x="0" y="0" width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start" }}>
                <div style={{ display: "flex", alignItems: "center"  }}>
                <PiNoteFill               style={{ width: "80px", height: "80px", color: "#FFD700" }}/>
                        {/* <img src={stickyNoteBase64}  /> */}
                        <span style={{ fontSize: `48px`, fontWeight: "bold", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {title}
                        </span>
                    </div>
                    <div style={{ fontSize:"30px" ,marginTop: "10px", display: "flex" }}>
                        <span  style={{ marginRight: "15px"}}>
                            {owner}
                        </span>
                        <span>
                            {dateFormat(createdAt,"yyyy/mm/dd HH:MM:ss")}
                        </span>
                    </div>
                </div>
            </foreignObject>
        </svg>
    )
    const svgStringify = ReactDOMServer.renderToString(svg);
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStringify);

    return url
}



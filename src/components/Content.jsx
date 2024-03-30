import React from "react";
import { useEffect, useState, useRef } from "react";
import {
    InstagramEmbed,
    YouTubeEmbed,
    TwitterEmbed,
    PinterestEmbed,
    TikTokEmbed,
} from "react-social-media-embed";

function Content({ category, urls, removeUrl, modifyNota }) {
    const notaRefs = useRef([]);
    const [elements, setElements] = useState([]);

    useEffect(() => {
        setElements(
            urls.map((el, i) => {
                let content;
                switch (analize(el.url)) {
                    case "imagen":
                        content = <img width="300px" src={el.url} />;
                        break;
                    case "youtube":
                        {
                            content = <YouTubeEmbed url={el.url} />;
                        }
                        break;
                    case "twitter":
                        content = (
                            <>
                                <TwitterEmbed url={el.url} />
                            </>
                        );
                        break;
                    case "instagram":
                        content = (
                            <>
                                <InstagramEmbed url={el.url} width={328} />
                            </>
                        );
                        break;
                    case "pinterest":
                        content = (
                            <>
                                <PinterestEmbed url={el.url} />
                            </>
                        );
                        break;
                    case "tiktok":
                        content = (
                            <>
                                <TikTokEmbed url={el.url} />
                            </>
                        );
                        break;
                    default:
                        content = <a href={el.url}>{el.url}</a>;
                        break;
                }
                return (
                    <li key={i} id={el.url}>
                        {content}
                        <textarea key={el.url}
                            ref={(element) => (notaRefs.current[i] = element)}
                            defaultValue={el.nota}
                        ></textarea>
                        <button onClick={actualizarNota} id={i}>
                            actualizar
                        </button>
                        <p>{el.fecha.seconds}</p>
                        <button onClick={remove}>X</button>
                    </li>
                );
            })
        );
    }, [urls]);
    const actualizarNota = (e) => {
        const nota = notaRefs.current[e.target.id].value;
        modifyNota({ url: urls[e.target.id].url, fecha: urls[e.target.id].fecha, nota: nota });
        console.log(nota);
    };
    const analize = (url) => {
        const imageExt = ["png", "jpg", "apng", "avif", "gif", "jpeg", "webp"];
        if (url.includes("youtube") || url.includes("youtu")) {
            return "youtube";
        }
        if (url.includes("pinterest")) {
            return "pinterest";
        }
        if (imageExt.includes(url.substr(url.lastIndexOf(".") + 1))) {
            return "imagen";
        }
        if (url.includes("instagram")) return "instagram";
        if (url.includes("tiktok")) return "tiktok";
        if (url.includes("twitter")) return "twitter";
        return "generic";
    };
    const remove = (event) => {
        event.stopPropagation();
        removeUrl(event.target.parentNode.id);
    };
    return (
        <>
            <h2>{category}</h2>
            <ul>{elements}</ul>
        </>
    );
}

export default Content;

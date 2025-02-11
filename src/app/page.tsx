"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function Home() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hls, setHls] = useState<Hls | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const response = await fetch("/api/canais");
                const data = await response.json();
                if (data && data.length > 0) {
                    setVideoUrl(data[0].url); // Pegando a primeira URL do banco
                }
            } catch (error) {
                console.error("Erro ao buscar a URL:", error);
            }
        };

        fetchUrl();
    }, []);

    useEffect(() => {
        if (videoRef.current && videoUrl) {
            const video = videoRef.current;
            const hlsInstance = new Hls({
                maxBufferLength: 10, // Mantém apenas 10 segundos de buffer
                maxBufferSize: 10 * 1000 * 1000, // Limita buffer a 10MB
                maxMaxBufferLength: 20, // No máximo 20s de buffer
                startPosition: -20
            });

            hlsInstance.loadSource(videoUrl);
            hlsInstance.attachMedia(video);
            setHls(hlsInstance);
        }

        return () => {
            if (hls) {
                hls.destroy(); // Remove o player da memória ao desmontar o componente
            }
        };
    }, [videoUrl]); // Roda quando a URL estiver pronta

    return (
        <div className="flex flex-col overflow-x-hidden h-screen ">
            <div className="flex justify-end mr-10">
                <a href={"./login"}>Adm</a>
            </div>
            <div className="flex items-center justify-center mt-20">
                {videoUrl ? (
                    <video ref={videoRef} controls autoPlay width="80%" height="auto" />
                ) : (
                    <p>Carregando vídeo...</p>
                )}
            </div>
        </div>
    );
}

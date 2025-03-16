import React, { useState, useEffect } from "react";
import './App.css';

function Photos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const BASE_URL = "https://botdisc-t53r.onrender.com";

    useEffect(() => {
        // Fazendo uma requisição para a API para buscar as imagens
        fetch(`${BASE_URL}/images`) // Usando a constante BASE_URL
            .then((response) => response.json())
            .then((data) => {
                setPhotos(data); // Armazena as imagens no estado
                setLoading(false); // Atualiza o estado de carregamento
            })
            .catch((error) => {
                console.error("Erro ao buscar as imagens:", error);
                setLoading(false); // Garante que o estado de carregamento seja alterado mesmo em erro
            });
    }, []);

    // Lidar com a seleção de imagem
    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    // Lidar com o envio do formulário de upload
    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedImage) {
            setMessage("Por favor, selecione uma imagem.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedImage);

        try {
            const response = await fetch(`${BASE_URL}/uploadImagem`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setMessage("Imagem enviada com sucesso!");
                // Atualizar as fotos após o upload
                const updatedPhotos = await fetch(`${BASE_URL}/images`);
                const updatedData = await updatedPhotos.json();
                setPhotos(updatedData); // Atualiza o estado com as novas fotos
            } else {
                setMessage("Erro ao enviar a imagem.");
            }
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
            setMessage("Erro ao tentar enviar a imagem.");
        }
    };

    return (
        <div className="app-container">
            <h1 className="title">Galeria de Fotos</h1>

            <div className="akatsuki-image">
                <img
                    src="/haha.jpg"
                    alt="ele está de olho"
                />
            </div>

            <form onSubmit={handleUpload} className="upload-form">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                />
                <button type="submit" className="upload-button">Enviar Imagem</button>
            </form>

            {message && <p className="message">{message}</p>}

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div className="photo-list">
                    {Array.isArray(photos) && photos.length > 0 ? (
                        photos.map((photo, index) => (
                            <img
                                key={index}
                                src={`${BASE_URL}${photo.url}`} // Usando BASE_URL para gerar o caminho correto
                                alt={`Imagem ${index + 1}`}
                                className="photo"
                            />
                        ))
                    ) : (
                        <p>Nenhuma imagem encontrada.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Photos;

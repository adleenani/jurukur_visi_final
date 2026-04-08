import React, { useState, useEffect } from "react";

const AboutPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState("");
    const [caption, setCaption] = useState("");

    const handleImageClick = (src, alt) => {
        setSelectedImg(src);
        setCaption(alt);
        setModalOpen(true);
    };

    // Google Map (React way)
    useEffect(() => {
        const loadMap = () => {
            if (window.google) {
                const map = new window.google.maps.Map(
                    document.getElementById("map-container"),
                    {
                        center: { lat: 3.200947, lng: 101.485829 },
                        zoom: 18,
                    }
                );

                new window.google.maps.Marker({
                    position: { lat: 3.200947, lng: 101.485829 },
                    map,
                });
            }
        };

        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js";
        script.async = true;
        script.onload = loadMap;

        document.body.appendChild(script);
    }, []);

    return (
        <>
            {/* ABOUT */}
            <div className="w3-container" style={{ padding: "128px 22px" }}>
                <h2 className="w3-center"><b>ABOUT THE COMPANY</b></h2>
            </div>

            {/* WORK */}
            <div className="w3-container" style={{ padding: "100px 16px" }}>
                <h2 className="w3-center"><b>OUR WORK</b></h2>
                <p className="w3-center w3-xlarge">
                    We are capable of achieving excellence in every project.
                </p>

                <div className="w3-row-padding" style={{ marginTop: "64px" }}>
                    {[
                        "visi1.jpg","visi2.jpg","visi9.jpg","visi4.jpg",
                        "visi5.jpg","visi6.jpg","visi7.jpg","visi8.jpg"
                    ].map((img) => (
                        <div key={img} className="w3-col l3 m6">
                            <img
                                src={`/images/${img}`}
                                alt="Survey project"
                                style={{ width: "100%" }}
                                className="w3-hover-opacity"
                                onClick={(e) =>
                                    handleImageClick(e.target.src, e.target.alt)
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div
                    className="w3-modal w3-black"
                    style={{ display: "block" }}
                    onClick={() => setModalOpen(false)}
                >
                    <span className="w3-button w3-xxlarge w3-display-topright">
                        ×
                    </span>
                    <div className="w3-modal-content w3-center w3-padding-64">
                        <img src={selectedImg} className="w3-image" alt="" />
                        <p className="w3-large">{caption}</p>
                    </div>
                </div>
            )}

            {/* MAP */}
            <div
                id="map-container"
                style={{
                    width: "100%",
                    height: "400px",
                    marginTop: "30px",
                }}
            ></div>
        </>
    );
};

export default AboutPage;
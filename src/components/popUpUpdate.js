import React, { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { API } from "../config/api";
import { kontenbase } from '../lib/kontenbase'


export default function PopUpUpdate({ item , refetch }) {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [preview, setPreview] = useState(item.image[0].url);

    const { id } = useParams();

    const [product, setProduct] = useState({});
    const [message, setMessage] = useState(null);


    const [form, setForm] = useState({
        name: item.name,
        image: item.image,
        buyPrice: item.buyPrice,
        sellPrice: item.sellPrice,
        qty: item.qty,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === "file" ? e.target.files : e.target.value,
        });

        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();
            const { data } = await kontenbase.storage.upload(form.image[0])

            const response = await API.patch("/products/" + item._id, {
                name: form.name,
                buyPrice: form.buyPrice,
                sellPrice: form.sellPrice,
                qty: form.qty,
                image: [{ fileName: data.fileName, url: data.url }]
            });
            console.log(response);
            setShow(!show);
            refetch()
        } catch (error) {
            if (error.message === "Request failed with status code 400") {
                const alert = <Alert variant="danger">Name cannot be same !</Alert>;
                setMessage(alert);
            }
            console.log(error);
        }
    });

    return (
        <>
            <Button
                onClick={handleShow}
                variant="secondary"
                style={{ width: "70px" }}
                className="text-white me-2 pointer"
            >
                Edit
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body>
                    {message}
                    <h3 className="text-center">Edit Product</h3>
                    <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                        {preview && (
                            <div>
                                <img
                                    src={preview}
                                    style={{
                                        maxWidth: "150px",
                                        maxHeight: "150px",
                                        objectFit: "cover",
                                    }}
                                    alt="preview"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            id="upload"
                            name="image"
                            hidden
                            onChange={handleChange}
                        />
                        <label className="my-3 text-primary" htmlFor="upload">
                            Upload File
                        </label>
                        <Form.Group>
                            <Form.Control
                                className="my-3"
                                type="text"
                                name="name"
                                defaultValue={item.name}
                                onChange={handleChange}
                                placeholder="name"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                className="my-3"
                                type="number"
                                name="buyPrice"
                                defaultValue={item.buyPrice}
                                onChange={handleChange}
                                placeholder="harga beli"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                className="my-3"
                                type="number"
                                name="sellPrice"
                                defaultValue={item.sellPrice}
                                onChange={handleChange}
                                placeholder="harga jual"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                className="my-3"
                                type="number"
                                name="qty"
                                defaultValue={item.qty}
                                onChange={handleChange}
                                placeholder="stok"
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-3" style={{ width: "100%" }}>
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

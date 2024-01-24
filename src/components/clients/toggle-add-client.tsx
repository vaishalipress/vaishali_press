"use client";
import { useState } from "react";
import AddClientForm from "./add-client";
import { Input } from "../ui/input";

const AddClient = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div onBlur={() => setIsOpen(false)}>
            {!isOpen ? (
                <Input
                    defaultValue={"Add Client"}
                    readOnly
                    onClick={() => setIsOpen(true)}
                />
            ) : (
                <AddClientForm />
            )}
        </div>
    );
};

export default AddClient;

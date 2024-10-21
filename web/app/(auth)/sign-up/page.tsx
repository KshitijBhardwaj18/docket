"use client";
import React, { useState } from "react";

export default function SignUp() {
  interface formDataInterface {
    userName: string;
    email: string;
    password: string;
  }
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<formDataInterface>({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (error) {
      setError(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //axios command
    console.log(formData);
  };

  return (
    <div className="border p-8">
        <div className="flex items-center justify-center font-bold text-xl mb-2 ">Docket - signUp</div>
      <form onSubmit={handleSubmit}>
        <label className="">
          <p className="font-bold">UserName</p>
          <input
            type="text"
            value={formData.userName}
            onChange={handleChange}
            className="border px-10 py-2 mt-3"
          />
        </label>

        <label>
          <p className="font-bold">Email</p>
          <input
            type="email"
            value={formData.userName}
            onChange={handleChange}
            className="border px-10 py-2 mt-3"
          />
        </label>

        <label>
          <p className="font-bold">Password</p>
          <input
            type="text"
            value={formData.userName}
            onChange={handleChange}
            className="border px-10 py-2 mt-3"
          />
        </label>

        {error && <p className=" bg-red">{error}</p>}
      </form>
    </div>
  );
}

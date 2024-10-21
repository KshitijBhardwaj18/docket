"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import api from "@/controllers/apiController";
import { UserProps } from "@/app/dashboard/[id]/page";

function SignIn() {
  interface formDataInterface {
    email: string;
    password: string;
  }
  
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<formDataInterface>({
    email: "",
    password: "",
  });

  const router = useRouter(); // Initialize useRouter

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = await api.post<UserProps>("/signin", { email: formData.email, password: formData.password });
      console.log(user.data);
      
      // Redirect using router.push
      router.push(`/dashboard/${user.data.id}`); // Use router.push for client-side navigation
    } catch (err) {
      setError("An error occurred during sign-in."); 
      console.log(err)// Handle errors appropriately
    }
  };

  return (
    <div className="border p-8">
      <div className="flex items-center justify-center font-bold text-xl mb-2">Docket - signIn</div>
      <form onSubmit={handleSubmit}>
        <label>
          <p className="font-bold">Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border px-10 py-2 mt-3"
          />
        </label>

        <label>
          <p className="font-bold">Password</p>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="border px-10 py-2 mt-3"
          />
        </label>

        {error && <p className="bg-red">{error}</p>}

        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignIn;
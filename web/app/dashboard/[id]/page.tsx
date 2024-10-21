"use client";

import api from "@/controllers/apiController";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Note {
  title: string;
  content: string;
  userId: string;
  color: string;
}

export interface UserProps {
  id: string;
  username: string;
  email: string;
  password: string;
  notes: Note[]; // Ensure this is always an array
}

const DashBoard: React.FC = () => {
  const params = useParams();
  const { id } = params; // Access the first segment of the id array
  console.log(id);

  const [user, setUser ] = useState<UserProps | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser  = async () => {
      try {
        const response = await api.post<UserProps>("/user", { id });
        setUser (response.data);
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      }
    };

    if (id) {
      fetchUser ();
    }
  }, [id]);

  return (
    <div>
      <div className="h-[32px] w-full flex flex-row justify-between p-10">
        <div className="text-black font-extrabold text-[20px]">Docket</div>
        <div>Logged in as: {user ? user.username : "Loading..."}</div>
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
  
      <div className="notes-container p-10">
        {user && user.notes && user.notes.length > 0 ? (
          user.notes.map((note) => (
            <div key={note.title} className={`note ${note.color}`}>
              <h2 className="note-title">{note.title}</h2>
              <p className="note-content">{note.content}</p>
            </div>
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
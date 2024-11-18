import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is installed and imported
import { toast } from "react-hot-toast";

const Paraphrase = ({ show, handleClose, accountId }) => {
  const [passphrase, setPassphrase] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  const handleChange = (index, event) => {
    const newPassphrase = [...passphrase];
    newPassphrase[index] = event.target.value;
    setPassphrase(newPassphrase);
  };

  const handleConfirm = async () => {
    const token = sessionStorage.getItem("accessToken");
    let userId = null;

    // Check if token exists and decode to get userId
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); 
        userId = decodedToken?.user_id;
        console.log("Logged in user ID:", userId);
      } catch (error) {
        console.error("Token decoding failed:", error);
        setError("Invalid token. Please log in again.");
        return;
      }
    } else {
      setError("No user is logged in.");
      return;
    }

    const passphraseString = passphrase.join(" "); // Combine passphrase inputs with spaces

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-passphrase", // Make sure the backend API is running
        { passphrase: passphraseString, user_id: userId }
      );

      if (response.data.success) {
        console.log("Passphrase verified successfully:", response.data);
        toast.success("Passphrase verified successfully.");
        handleClose(); // Close the modal after successful verification
        // Use accountId dynamically in navigate
        navigate(`/view-acc-details/${accountId}`);
      } else {
        toast.error("Invalid passphrase. Please try again.");

      }
    } catch (error) {
      console.error("Error verifying passphrase:", error);
      toast.error("An error occurred. Please try again later.");

    }
  };

  if (!show) return null; // If `show` is false, do not render the modal

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Enter Your Passphrase</h2>
          <button onClick={handleClose} className="text-black font-bold text-xl">
            X
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Enter Your Passphrase
          </label>
          <div className="flex justify-between">
            {passphrase.map((value, index) => (
              <input
                key={index}
                type="text"
                value={value}
                onChange={(e) => handleChange(index, e)}
                maxLength="20"
                className="w-1/5 p-2 border border-gray-300 rounded text-center"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Close
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paraphrase;

import React, { useState } from "react";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { FaTrash } from "react-icons/fa"; // Import trash icon
import Login from "../components/Login";
import Paraphrase from "../components/users/Paraphrase"; 

const MenuCard = (props) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showParaphraseModal, setShowParaphraseModal] = useState(false); // State for Paraphrase modal
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleCheckPasswordStrength = () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      setShowLoginPrompt(true);
    } else {
      // Show Paraphrase modal if user is logged in
      setShowParaphraseModal(true);
    }
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
    setShowLoginPrompt(false);
  };

  const handleRemoveCard = async (id) => {
    try {
      // Call the API to delete the account
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/users/DeleteAccount/${id}`
      );
      console.log("Delete response:", response.data);

      // Notify parent component (if needed)
      if (props.onRemove) {
        props.onRemove(props.id);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="w-72 h-96 bg-white p-3 rounded-lg pt-5 mt-5 flex flex-col justify-between">
      {/* Card Content */}
      <div>
        <img
          className="w-full h-40 rounded-xl object-cover"
          src={props.img}
          alt="img1"
        />
      </div>
      <div className="p-2 mt-5 flex-grow">
        <div className="flex flex-row justify-between">
          <h3 className="font-semibold text-xl">{props.title}</h3>
          <h3 className="font-semibold text-xl">{props.value}</h3>
        </div>
        <div className="flex flex-row justify-between mt-3">
          <div className="flex gap-2">
            <button
              className="px-6 py-1 border-2 border-[#212071] bg-[#a2b6e5] hover:text-[#4e66b6] transition-all rounded-full"
              onClick={handleCheckPasswordStrength}
            >
              View Account Details
            </button>
          </div>
          <button
            className="text-red-500 hover:text-red-700 transition-all"
            onClick={() => handleRemoveCard(props.id)} // Directly call handleRemoveCard
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Modal for Paraphrase */}
      <Paraphrase
        show={showParaphraseModal}
        handleClose={() => setShowParaphraseModal(false)}
        accountId = {props.id}
      />

      {/* Modal for Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl mb-4">
              You need to log in to check password strength.
            </h2>
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              onClick={toggleLoginModal}
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Modal for Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <button
              className="text-black font-bold text-xl mb-4"
              onClick={toggleLoginModal}
            >
              X
            </button>
            <Login onLoginSuccess={toggleLoginModal} /> {/* Pass the callback */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuCard;

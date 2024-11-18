import React, { useState, useEffect } from "react";
import img1 from "../assets/img/apps/google.png";
import img2 from "../assets/img/apps/fb.png";
import img3 from "../assets/img/apps/ig.png";
import img4 from "../assets/img/apps/tiktok.png";
import img5 from "../assets/img/apps/yt.png";
import img6 from "../assets/img/apps/other apps.png";
import MenuCard from "../layouts/MenuCard";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AccountPage from "../components/AccountPage"; // Corrected import path

const getCurrentUser = () => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const userId = decodedToken?.user_id;  
    console.log("Logged in user ID:", userId);
    return userId;
  } else {
    console.log("No user is logged in.");
    return null;
  }
};

const Menu = () => {
  const [accounts, setAccounts] = useState([]);  
  const id = getCurrentUser();  
  const navigate = useNavigate(); // Initialize useNavigate
  const [showAccountModal, setShowAccountModal] = useState(false); // State for account modal

  const fetchAccounts = async (id) => {
    if (id) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/FetchAccount/${id}`);
        console.log("Fetched accounts:", response.data);
        setAccounts(response.data);  
      } catch (error) {
        console.error("Fetch error:", error.response ? error.response.data : error.message);
        
      }
    }
  };

  useEffect(() => {
    fetchAccounts(id);  
  }, [id]); 

  const toggleAccountModal = () => {
    setShowAccountModal(!showAccountModal);
  };

  const handleAccountCreated = () => {
    fetchAccounts(id);
    setShowAccountModal(false);
    window.location.href = '/menu'; // Refresh the page after closing the modal
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:justify-between items-center lg:px-32 px-5 gap-10 bg-gradient-to-r from-[#0e397e] to-[#75a6a3]">
      <div className="w-full flex justify-end p-5 absolute top-16 right-16">
        <div className="text-right">
          <p className="text-white mb-2">Don't have an account yet?</p>
          <button 
            onClick={toggleAccountModal} 
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Create Account
          </button>
        </div>
      </div>

      <div className="flex flex-wrap pb-8 gap-8 justify-center mt-24"> {/* Added mt-10 for margin-top */}
        {accounts.length > 0 ? (
            // Map over the fetched accounts and render MenuCard for each account
            accounts.map((account, index) => (
              <MenuCard key={index} img={'http://127.0.0.1:8000' + account.image || img6} title={account.name} id = {account.id}/>
              
            ))
          ) : (
            // If no accounts are fetched, display a message or loading indicator
            <p>No accounts found or loading...</p>
          )}
      </div>

      {/* Modal for Account Page */}
      {showAccountModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          style={{ zIndex: 100 }}
        >
          <div className="bg-white p-8 rounded-lg w-11/12 lg:w-8/12">
            <button
              className="text-black font-bold text-xl mb-4"
              onClick={toggleAccountModal}
            >
              X
            </button>
            <AccountPage isVisible={showAccountModal} onClose={toggleAccountModal} onAccountCreated={handleAccountCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
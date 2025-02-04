// Here we can have bunch of different states and functions that we can use
import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set)=>({
    authUser:null, //initial state is going to be null cuz we don't know if the user is authenticated or not. We'll check for it.
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile:false,
    isCheckingAuth: false,//loading state 
    onlineUsers:[],
    
    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null });//not authenticated
        }
        finally{
            set({ isCheckingAuth:false });
        }
    },

    signup: async(data)=>{
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser:res.data });
            toast.success("Account created successfully");
           
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({ isSigningUp: false})
        }
    },

    login: async(data)=>{
      set({ isLoggingIng: true});
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }  
      finally{
        set({ isLoggingIng: false })
      }
    },

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("error in update profile", error);
            toast.error(error.response.data.message);
        }
        finally{
            set({isUpdatingProfile: false })
        }
    },
}));
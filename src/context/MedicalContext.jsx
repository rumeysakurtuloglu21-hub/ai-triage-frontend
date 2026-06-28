import { createContext, useEffect, useState } from "react";

export const MedicalContext = createContext();

export default function MedicalProvider({ children }) {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const getProfile = async () => {

      try {

        const user =
          JSON.parse(localStorage.getItem("user"));

        if (!user) {
          setLoading(false);
          return;
        }


        const response = await fetch(
          "http://127.0.0.1:8000/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // token varsa buraya gelecek
            }
          }
        );


        if(response.ok){

          const data =
            await response.json();

          setProfile(data);

        }


      } catch(err){

        console.log(
          "Profil alınamadı",
          err
        );

      } finally {

        setLoading(false);

      }

    };


    getProfile();

  }, []);



  return (

    <MedicalContext.Provider
      value={{
        profile,
        setProfile,
        loading
      }}
    >

      {children}

    </MedicalContext.Provider>

  );
}
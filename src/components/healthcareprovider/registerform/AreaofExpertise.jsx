import styles from "../../../components/patient/add/addform/addFormStyles.module.css";
import classes from "./AreaofExpertise.module.css";
import { healthCareProviderActions } from "@/store/generalStore";
import Link from "next/link";
import svgObject from "@/styles/svgIcons";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";


const AreaofExpertise = (props) => {
  const regData = useSelector(state => state.healthCareProvider.healthRegisterData)
  const [dataIsFetching, setDataIsFetching] = useState(false);
  const [text, setText] = useState("");
  const [textValid, setTextValid] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  console.log(regData, 'drtyjg')

  const buttonClass = textValid
    ? `${styles.button} ${styles.valid_button}`
    : `${styles.button}`;

  useEffect(() => {
    if (text.length > 2) {
      setTextValid(true);
    } else {
      setTextValid(false);
    }
  }, [text]);

  const updateExpertiseTextHandler = (event) => {
    setText(event.target.value);
  };

  const createPractitionerHandler = async () => {
     dispatch(healthCareProviderActions.updateHealthRegisterData({expertise: text}))
    if (textValid) {
      setDataIsFetching(true);
      try {
        const registerRequest = await fetch(`/api/register-new`, {
          method: "POST",
          body: JSON.stringify(regData),
          headers: {
            role: 'practitioner'
          }
        });

        if (!registerRequest.ok) {
          // we handle the error if bad status code comes
          const errorData = await registerRequest.json();
          throw new Error(errorData.error || "Something went wrong");
        }

        console.log(registerRequest.status);

        const response = await registerRequest.json();
        console.log(response);
        console.log(response.data.data.token)
        dispatch(tokenActions.updateToken(response.data.data.token))
        localStorage.setItem("token", response.data.data.token);
        setDataIsFetching(false)
        //Navigate to the regComplete page upon completion
        router.push("/patient/registerform/register-complete");
      } catch (err) {
        console.log(err);
        router.push('/')
      }
    }
  };

  return (
    <section className={styles.container}>
      {dataIsFetching && (
        <div className={classes.loading_spinner}>
          <TailSpin
            color="#066dfe"
            ariaLabel="tail-spin-loading"
            visible={true}
          />
        </div>
      )}
      {!dataIsFetching && (
        <>
          <div className={styles.back}>
            <Link
              href="/healthcareprovider/registerform"
              className={styles.back_button}
            >
              {svgObject.goBack}
            </Link>
          </div>
          <form className={styles.form}>
            <div className={styles.form_input}>
              <div className={classes.area_svg}> {svgObject.doctorSvg}</div>
              <h1>What is your area of medical expertise?</h1>
              <div> {svgObject.hundredpercent}</div>
              <input
                onChange={updateExpertiseTextHandler}
                className={classes.area_input}
                type="text"
                placeholder="Enter area of Expertise here"
                name="area-expert"
              />
            </div>
          </form>
          <div className={styles.next_question}>
            <div className={buttonClass} onClick={createPractitionerHandler}>
              Done &gt;
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AreaofExpertise;

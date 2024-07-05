import svgObject from "@/styles/svgIcons";
import styles from '../../patient/registerform/FormStyles.module.css'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { healthCareProviderActions } from "@/store/generalStore";

const GetPractitionerGender = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [checkedOption, setCheckedOption] = useState(null)
  const [formValid, setFormValid] = useState(false);

  const buttonClass = formValid
    ? `${styles.button} ${styles.valid_button}`
    : `${styles.button}`;

   const updateCheckedHandler = event => {
       if( event.target.checked){
        setCheckedOption(event.target.name)
       }
   };
console.log(checkedOption)

const currentCheck = arg => arg === checkedOption ? true : false ;

useEffect(() => {
     if(checkedOption !== null){
      setFormValid(true)
     }
}, [checkedOption])

   const nextPageHandler = () => {
    //Here, we update the store with data from the validated form and then
    // programatically move to the next page
    if (formValid) {
      dispatch(
       healthCareProviderActions.updateHealthRegisterData(
        {
          gender: checkedOption
        }
        )
      );
      //Navigate to the next page
      router.push("/healthcareprovider/registerform/areaofexpertise");
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.back}>
        <Link href="/healthcareprovider/registerform/dateofbirth" className={styles.back_button}>
          {svgObject.goBack}
        </Link>
      </div>
      <form className={styles.form}>
        <div className={styles.svg}>{svgObject.gender}</div>
        <h1>How do you identify?</h1>

        <div className={styles.percent_svg}>{svgObject.fiftyPercent}</div>
        <div className={styles.form_input}>
          <ul className={styles.pick_gender}>
            <li>
              <label className={styles.circular_checkbox}>
                <input type="checkbox" name="male" checked = {currentCheck('male')} onChange={updateCheckedHandler}/>
                <span className={styles.checkmark}></span>
               Male
              </label>
            </li>
            <li>
            <label className={styles.circular_checkbox}>
                <input type="checkbox" name="female" checked={currentCheck('female')} onChange={updateCheckedHandler}/>
                <span className={styles.checkmark}></span>
             Female
              </label>
            </li>
            <li>
            </li>
          </ul>
        </div>
      </form>

      <div className={styles.next_question}>
        <div onClick={nextPageHandler} className={buttonClass}>
          Next &gt;
        </div>
      </div>
    </section>
  );
};

export default GetPractitionerGender;


import React from 'react'
import Styles from './Awards.module.css'
import { useTranslation } from 'react-i18next';

const Awards = () => {
    const { t } = useTranslation();
    return (
        <div>
            <div className = {Styles.borderSeprator}></div>
            <div className = {Styles.awardsContainer}>
                <div className = {Styles.awardHeading}>{t('awards.title')}</div>
                <div style = {{display : "flex" , justifyContent : "space-evenly",alignItems : "center", marginTop : "40px", marginBottom : "70px"}}>
                    <div style = {{display : "flex" , flexDirection : "column" , justifyContent : "space-evenly" , height : "200px",alignItems : "center" }}>
                        <img src = "https://s2.rdbuz.com/web/images/home/awards/Business_Standard1.png" alt = "" />
                        <div className = {Styles.awardsPara}>
                            {t('awards.mostInnovative')}
                        </div>
                    </div>
                    <div>
                        <img src = "https://s1.rdbuz.com/web/images/home/awards/Brand_Trust_Report.png" alt = "" />
                        <div className = {Styles.awardsPara}>
                            {t('awards.mostTrusted')}
                        </div>
                    </div>
                    <div>
                        <img src = "https://s3.rdbuz.com/web/images/home/awards/Eye_for_Travel1.png" alt = "" />
                        <div className = {Styles.awardsPara} style = {{marginLeft : "70px"}}>
                            {t('awards.mobileInnovation')}
                        </div>
                    </div>
                </div>
            </div>
            <div className = {Styles.borderSeprator}></div>
        </div>
    )
}

export default Awards

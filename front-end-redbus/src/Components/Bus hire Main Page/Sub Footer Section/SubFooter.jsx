
import React from 'react'
import Styles from './Subfooter.module.css'
import { useTranslation } from 'react-i18next';

const SubFooter = () => {
    const { t } = useTranslation();
    return (
        <div>
            <div className={Styles.subFootercontainer}>
                <div className={Styles.subFootercontainer_eachSection}>
                    <h4>{t('footer.busHireCities')}</h4>
                    <p>{t('footer.busHireAhmedabad')}</p>
                    <p>{t('footer.busHireMumbai')}</p>
                    <p>{t('footer.busHireBangalore')}</p>
                    <p>{t('footer.busHireChennai')}</p>
                </div>
                <div className={Styles.subFootercontainer_alternateSection}>
                    <p>{t('footer.busHirePune')}</p>
                    <p>{t('footer.busHireHyderabad')}</p>
                    <p>{t('footer.busHireDelhi')}</p>
                    <p>{t('footer.busHireDelhi')}</p>
                </div>
                <div className={Styles.subFootercontainer_eachSection}>
                    <h4>{t('footer.tempoTravellers')}</h4>
                    <p>{t('footer.tempoBangalore')}</p>
                    <p>{t('footer.tempoAhmedabad')}</p>
                    <p>{t('footer.tempoCoimbatore')}</p>
                    <p>{t('footer.tempoVadodara')}</p>
                    <p>{t('footer.tempoKolkata')}</p>
                </div>
                <div className={Styles.subFootercontainer_alternateSection}>
                    <p>{t('footer.tempoDelhi')}</p>
                    <p>{t('footer.tempoPune')}</p>
                    <p>{t('footer.tempoMumbai')}</p>
                    <p>{t('footer.tempoHyderabad')}</p>
                    <p>{t('footer.tempoChennai')}</p>
                </div>
            </div>
        </div>
    )
}

export default SubFooter

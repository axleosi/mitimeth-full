import React from 'react'
import styles from './Other.module.css'

const Other = () => {
  return (
    <div className={styles.container}>
        <div className={styles.banana}>
            <h2>Banana</h2>
            <p>Banana and plantain are tropical crops belonging to the Musa family and the world's most important food crop. In sub-Saharan Africa, Uganda is the largest producer followed by Rwanda, Ghana, Nigeria and Cameroon. With leaf sheaths that form stems, the heights of these crops range from 10-40 feet surrounded with large leaves. After the harvesting of the fruits, the stems and leaves are traditionally discarded as agricultural residues. In Nigeria, they contribute to national food security, employment and diversified income in rural and urban areas.</p>
        </div>

        <div className={styles.paper}>
            <h2>Paper</h2>
            <p>Both water hyacinth and banana fibre can be used to make various types of specialty paper. At Mitimeth, we use these fibres to create paper for greeting cards, paper lampshades, envelopes, paper for drawing, wrapping paper, wedding stationery and cards for crafts</p>
        </div>

        <div className={styles.coconut}>
            <h2>Coconut</h2>
            <p>The coconut is a tropical tree, mainly grown and harvested by small-scale farmers. Nigeria ranks 18th in worldwide production. Apart from consuming the fruit and water, the parts of the plant are also used by many industries such as pharmaceuticals, food and beverage, cosmetics. The utilization of agricultural residues like coconut shells contributes to economic development. Our goal at MitiMeth is to take an agricultural residue of little value and turn it into an environmentally-friendly, valuable commodity. The discarded shells are collected from coconut food and cosmetic producers and made into fashion accessories and home decor items</p>
        </div>

        <div className={styles.bamboo}>
            <h2>Bamboo</h2>
            <p>The prevalent use of bamboo in Nigeria is for building scaffolding. After which the bamboo is discarded or used for fuel wood. Vary rarely is it used for home goods. MitiMeth has introduced an aesthetic twist by recovering and adding value to bamboo. Our upcycled bamboo products include mini spoons, combs, vases, keychains and lamps.</p>
        </div>
    </div>
  )
}

export default Other
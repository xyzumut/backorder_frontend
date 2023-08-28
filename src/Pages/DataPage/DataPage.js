import { motion } from "framer-motion";
import React from "react";

const DataPage = () => {

    return (
        <motion.div
            initial = {{ opacity:0, translateY:100  }}
            animate = {{ opacity:1, translateY:0    }}
        > 
            <h1>Veri Sayfası </h1>
        </motion.div>)
}
export default DataPage;
import { motion } from "framer-motion";
import React from "react";


const NetSearchPage = () => {


    return (
        <motion.div
            initial = {{ opacity:0, translateY:100 }}
            animate = {{ opacity:1, translateY:0   }}
        > 
            <h1> İnternet Aramaları Sayfası </h1>
        </motion.div>)
}
export default NetSearchPage;
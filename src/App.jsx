import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '@fontsource/fredoka-one';
import '@fontsource/quicksand';

const imageModules = import.meta.glob('../Assets/results/*.{png,jpg,jpeg,gif,webp}', { eager: true });
const resultImages = Object.values(imageModules).map(mod => mod.default);

const audioModules = import.meta.glob('../Assets/audio/*.{mp3,wav,ogg}', { eager: true });
const audioFiles = Object.values(audioModules).map(mod => mod.default);

function App() {
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [isChoosing, setIsChoosing] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  
  const audioRef = useRef(null);

  const handleChoose = () => {
    if (!option1.trim() || !option2.trim()) return;

    setIsChoosing(true);
    setWinner(null);
    setWinnerIndex(null);
    setResultImage(null);

    if (audioFiles.length > 0) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioFiles[0]);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    let count = 0;
    const interval = setInterval(() => {
      setHighlight(count % 2 === 0 ? 1 : 2);
      count++;
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setHighlight(null);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const chooseRandom = Math.floor(Math.random()*10);
      const isOption1 = (chooseRandom%2==0);
      const chosen = isOption1 ? option1 : option2;
      setWinner(chosen);
      setWinnerIndex(isOption1 ? 1 : 2);
      
      if (resultImages.length > 0) {
        const randomImg = resultImages[Math.floor(Math.random() * resultImages.length)];
        setResultImage(randomImg);
      }
      
      setIsChoosing(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] text-[#333333] flex flex-col items-center justify-center p-6 selection:bg-[#FF6B6B] selection:text-white overflow-hidden" style={{ fontFamily: "'Quicksand', sans-serif" }}>
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center mb-12 space-y-2"
        >
          <h1 className="text-5xl md:text-6xl text-[#FF6B6B] drop-shadow-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>
            This or That?
          </h1>
          <p className="text-[#4ECDC4] text-xl font-bold tracking-wide">
            {"Let the universe decide! ;)"}
          </p>
        </motion.div>

        <div className="relative w-full flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-10 mb-12">
          
          <motion.div 
            whileHover={!isChoosing && !winner ? { scale: 1.05, rotate: -2, y: -5 } : {}}
            whileTap={!isChoosing && !winner ? { scale: 0.95 } : {}}
            animate={{
              scale: highlight === 1 ? 1.1 : 1,
              rotate: highlight === 1 ? 3 : 0,
              boxShadow: highlight === 1 ? "0 25px 50px -12px rgba(255, 107, 107, 0.5)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              borderColor: highlight === 1 ? "#FF6B6B" : "transparent"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex-1 bg-white rounded-4xl p-3 border-4 z-10"
          >
            <div className="bg-[#FFF0F0] rounded-3xl h-full p-4 flex items-center justify-center">
              <input
                type="text"
                value={option1}
                onChange={(e) => { setOption1(e.target.value); setWinner(null); }}
                placeholder="First thing..."
                disabled={isChoosing}
                className="w-full text-center text-3xl md:text-4xl font-bold text-[#FF6B6B] bg-transparent outline-none placeholder:text-[#FFB3B3] placeholder:font-medium"
                style={{ fontFamily: "'Fredoka One', cursive" }}
              />
            </div>
          </motion.div>

          <motion.div 
            animate={{ scale: isChoosing ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5, repeat: isChoosing ? Infinity : 0, ease: "easeInOut" }}
            className="flex items-center justify-center py-2 md:py-0 z-20"
          >
            <div className="w-16 h-16 rounded-full bg-[#4ECDC4] text-white flex items-center justify-center text-2xl shadow-lg border-4 border-white transform rotate-12" style={{ fontFamily: "'Fredoka One', cursive" }}>
              VS
            </div>
          </motion.div>

          <motion.div 
            whileHover={!isChoosing && !winner ? { scale: 1.05, rotate: 2, y: -5 } : {}}
            whileTap={!isChoosing && !winner ? { scale: 0.95 } : {}}
            animate={{
              scale: highlight === 2 ? 1.1 : 1,
              rotate: highlight === 2 ? -3 : 0,
              boxShadow: highlight === 2 ? "0 25px 50px -12px rgba(78, 205, 196, 0.5)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              borderColor: highlight === 2 ? "#4ECDC4" : "transparent"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex-1 bg-white rounded-4xl p-3 border-4 z-10"
          >
            <div className="bg-[#E6F9F7] rounded-3xl h-full p-4 flex items-center justify-center">
              <input
                type="text"
                value={option2}
                onChange={(e) => { setOption2(e.target.value); setWinner(null); }}
                placeholder="Second thing..."
                disabled={isChoosing}
                className="w-full text-center text-3xl md:text-4xl font-bold text-[#4ECDC4] bg-transparent outline-none placeholder:text-[#A6E4DF] placeholder:font-medium"
                style={{ fontFamily: "'Fredoka One', cursive" }}
              />
            </div>
          </motion.div>

        </div>

        <AnimatePresence mode="wait">
          {!winner && (
            <motion.button
              key="choose-btn"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, y: 50 }}
              whileHover={(!isChoosing && option1.trim() && option2.trim()) ? { scale: 1.05, y: -2 } : {}}
              whileTap={(!isChoosing && option1.trim() && option2.trim()) ? { scale: 0.95, y: 4, boxShadow: "0 0px 0 #D9534F" } : {}}
              onClick={handleChoose}
              disabled={isChoosing || !option1.trim() || !option2.trim()}
              className={`
                group relative px-10 py-5 bg-[#FF6B6B] text-white rounded-full text-2xl shadow-[0_8px_0_#D9534F]
                transition-colors duration-200 ease-out overflow-hidden z-20
                ${(!option1.trim() || !option2.trim()) ? 'opacity-50 cursor-not-allowed shadow-none translate-y-2' : 'hover:bg-[#FF5252]'}
              `}
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              <motion.span 
                animate={{ y: isChoosing ? -60 : 0 }}
                className="inline-block"
              >
                Choose For Me!
              </motion.span>
              <motion.span 
                animate={{ y: isChoosing ? 0 : 60 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.span 
                  animate={{ rotate: isChoosing ? [0, -20, 20, -20, 20, 0] : 0 }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-3xl"
                >
                  🎲
                </motion.span>
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {winner && (
            <motion.div 
              key="winner-display"
              initial={{ opacity: 0, y: 100, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="flex flex-col items-center w-full z-30"
            >
              <div className={`bg-white px-8 md:px-12 py-10 rounded-[3rem] shadow-2xl border-8 w-full max-w-2xl relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 transition-colors duration-500 ${winnerIndex === 1 ? 'border-[#FF6B6B] bg-[#FFF0F0]' : 'border-[#4ECDC4] bg-[#E6F9F7]'}`}>
                <motion.div 
                  animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-8 -right-8 text-7xl z-10"
                >
                  🎉
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
                  className="absolute -bottom-8 -left-8 text-7xl z-10"
                >
                  ✨
                </motion.div>
                
                {resultImage && (
                  <motion.img 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: -5 }}
                    transition={{ type: "spring", delay: 0.3, bounce: 0.6 }}
                    src={resultImage} 
                    alt="Result meme" 
                    className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-xl shrink-0 z-20"
                  />
                )}

                <div className="flex flex-col items-center justify-center flex-1 z-20">
                  <p className={`font-bold mb-2 uppercase tracking-widest text-center text-lg ${winnerIndex === 1 ? 'text-[#FF6B6B]' : 'text-[#4ECDC4]'}`}>The universe has spoken</p>
                  <div className={`text-5xl md:text-7xl text-center wrap-break-word leading-tight ${winnerIndex === 1 ? 'text-[#D9534F]' : 'text-[#3B9B94]'}`} style={{ fontFamily: "'Fredoka One', cursive" }}>
                    {winner}
                  </div>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => { setWinner(null); setWinnerIndex(null); setOption1(''); setOption2(''); }}
                className={`mt-10 px-8 py-3 bg-white rounded-full font-bold text-xl shadow-md border-2 transition-colors ${winnerIndex === 1 ? 'text-[#FF6B6B] border-[#FF6B6B]' : 'text-[#4ECDC4] border-[#4ECDC4]'}`}
              >
                Play Again 🔄
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
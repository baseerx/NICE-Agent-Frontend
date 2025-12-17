import { motion, AnimatePresence } from "framer-motion";
type InputUpdateProps = {
  value: string;
    setValue: (value: string) => void;
    onupdate: (e: React.FormEvent) => void;
    loader?: boolean;
};
const InputUpdate: React.FC<InputUpdateProps> = ({ value, setValue, onupdate,loader }) => {
  return (
    <>
      <AnimatePresence>
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
          />
          <button
            onClick={onupdate}
            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-3 py-2 rounded-xl text-sm"
          >
            {loader ? "Updating..." : "Update"}
          </button>
        </motion.form>
      </AnimatePresence>
    </>
  );
};

export default InputUpdate;

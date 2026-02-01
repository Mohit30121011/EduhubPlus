import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 inline-block">
                {title}
            </h1>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full mt-2"
                style={{ maxWidth: '100%' }}
            />
            {subtitle && (
                <p className="text-gray-500 mt-4">{subtitle}</p>
            )}
        </div>
    );
};

export default PageHeader;

import Link from "next/link";
import { motion } from "framer-motion";

export const MainFooter = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t"
    >
      <div className="pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 place-items-start md:place-items-center max-w-7xl mx-auto gap-8 px-4 sm:px-6 md:px-8 text-sm">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4">Frontend Hub</h3>
            <p className="text-muted-foreground">
              Empowering developers with web development resources.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#faq" className="hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-primary">
                  Blogs
                </Link>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/roadmap" className="hover:text-primary">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/examples" className="hover:text-primary">
                  Code Examples
                </Link>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/twitter" className="hover:text-primary">
                  Linked in
                </Link>
              </li>
              <li>
                <Link href="/github" className="hover:text-primary">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="/discord" className="hover:text-primary">
                  Instagram
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-8 py-4 border-t text-center text-muted-foreground"
        >
          © {new Date().getFullYear()} Frontend Hub, All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
};

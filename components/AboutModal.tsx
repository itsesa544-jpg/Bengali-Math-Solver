
import React from 'react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-800">🌐 IM Softworks</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-8 text-slate-700">
          <section>
            <p className="mb-2"><strong>বাংলা:</strong> IM Softworks একটি উদীয়মান সফটওয়্যার কোম্পানি, যা ভবিষ্যতমুখী প্রযুক্তি ও সৃজনশীল সমাধানের মাধ্যমে ক্লায়েন্টদের ব্যবসায়িক সাফল্যে সহায়তা করে। আমরা বিশ্বাস করি— আমাদের উন্নতি তখনই সম্ভব, যখন আমাদের ক্লায়েন্ট লাভবান হবেন।</p>
            <p className="italic font-semibold text-center my-4 text-blue-600">আমরা শুধু সফটওয়্যার তৈরি করি না — <br/> আমরা সম্ভাবনা গড়ে তুলি।</p>
            <p><strong>English:</strong> IM Softworks is an emerging software company that empowers clients’ business success through futuristic technology and innovative solutions. We believe that our growth is only possible when our clients benefit.</p>
            <p className="italic font-semibold text-center mt-4 text-blue-600">We don’t just build software — <br/> We build possibilities.</p>
          </section>

          <section className="border-t pt-6">
            <h3 className="text-lg font-bold mb-3">🎯 আমাদের লক্ষ্য (Our Mission)</h3>
            <p className="mb-2"><strong>বাংলা:</strong> “আপনার লাভই আমাদের সফলতা।”</p>
            <p className="mb-4">আমরা প্রতিটি প্রজেক্টে বিশ্বাস করি— যদি ক্লায়েন্ট উপকৃত হন, তবেই আমরা সফল। সেই লক্ষ্যেই আমাদের প্রতিটি কোড, প্রতিটি ডিজাইন এবং প্রতিটি আইডিয়া।</p>
            <p className="mb-2"><strong>English:</strong> “Your profit is our success.”</p>
            <p>In every project, we believe that our true achievement lies in the client’s benefit. That’s why every line of our code, every design, and every idea is driven by this mission.</p>
          </section>

          <section className="border-t pt-6">
            <h3 className="text-lg font-bold mb-3">🔧 আমাদের সার্ভিসসমূহ (Our Services)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <p className="font-semibold mb-2">বাংলা:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>কাস্টম সফটওয়্যার ডেভেলপমেন্ট</li>
                  <li>ওয়েব অ্যাপ্লিকেশন</li>
                  <li>মোবাইল অ্যাপ</li>
                  <li>ক্লাউড সল্যুশন</li>
                  <li>API ডেভেলপমেন্ট</li>
                  <li>UI/UX ডিজাইন</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2 mt-4 md:mt-0">English:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Custom Software Development</li>
                  <li>Web Applications</li>
                  <li>Mobile Apps</li>
                  <li>Cloud Solutions</li>
                  <li>API Development</li>
                  <li>UI/UX Design</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="border-t pt-6 flex flex-col md:flex-row gap-6 items-center">
            <img src="https://res.cloudinary.com/dlklqihg6/image/upload/v1760308052/kkchmpjdp9izcjfvvo4k.jpg" alt="Mohammad Esa Ali" className="w-32 h-32 rounded-full object-cover shadow-md flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold mb-2">👋 About Me</h3>
              <p>Hello, I am Mohammad Esa Ali, a passionate and creative tech enthusiast. I specialize in Software Development, Web Solutions, and Creative Design. My goal is to help businesses grow by building smart, future-ready, and user-friendly digital solutions.</p>
              <blockquote className="mt-2 pl-4 border-l-4 border-slate-300 italic">
                “Success comes when your clients succeed.”
              </blockquote>
            </div>
          </section>

          <section className="border-t pt-6">
             <h3 className="text-lg font-bold mb-3">🏢 About Us (Section)</h3>
             <p>IM Softworks is an emerging software company focused on empowering businesses with futuristic technology and innovative solutions.</p>
             <p className="mt-2 italic">We believe our success comes only when our clients succeed. That’s why we don’t just build software — we build possibilities.</p>
          </section>
          
          <section className="border-t pt-6">
             <h3 className="text-lg font-bold mb-3">🛠️ Products (Section)</h3>
             <p>We develop smart, scalable, and future-ready software products tailored to meet the unique needs of modern businesses. Our products are designed to help you:</p>
             <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Automate processes</li>
                <li>Improve efficiency</li>
                <li>Scale with confidence</li>
             </ul>
          </section>

          <section className="border-t pt-6">
            <h3 className="text-lg font-bold mb-3">Connect with us</h3>
            <p><strong>Contact us:</strong> <a href="mailto:im.softwark.team@gmail.com" className="text-blue-600 hover:underline">im.softwark.team@gmail.com</a></p>
          </section>

        </div>
        
        <div className="sticky bottom-0 bg-slate-50 border-t p-4 text-center text-sm text-slate-500 z-10">
          Copyright © IM Softwark
        </div>
      </div>
    </div>
  );
};

export default AboutModal;

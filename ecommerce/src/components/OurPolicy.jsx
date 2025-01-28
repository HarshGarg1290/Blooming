import { assets } from "../assets/assets";
import Title from "./Title";

const OurPolicy = () => {
	return (
		<div className=" font-hubot text-center py-8 text-3xl ">
			<Title text1="OUR" text2=" POLICY" />
			<div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-5 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700  ">
				<div className="font-raleway">
					<img src={assets.exchange_icon} alt="" className="w-24 m-auto mb-1" />
					<p className="font-semibold ">EASY EXCHANGE POLICY</p>
					<p>
						We provide a seamless and stress-free exchange process. <br />
						<span className="text-xs"> Terms and Condition applied</span>
					</p>
				</div>
				<div className="font-raleway">
					<img
						src={assets.support_img}
						alt=""
						className="w-24 m-auto mb-1 mt-[-7px]"
					/>
					<p className="font-semibold ">24/7 CUSTOMER SUPPORT</p>
					<p>We offer 24/7 customer support to assist you anytime.</p>
				</div>
				<div className="font-raleway">
					<img
						src={assets.custom_alter_icon}
						alt=""
						className="w-24 m-auto mb-1 mt-3"
					/>
					<p className="font-semibold mt-5 ">CUSTOM ALTERATIONS</p>
					<p>
						We offer custom alterations to suit your style and fit flawlessly.
					</p>
				</div>
			</div>
		</div>
	);
};

export default OurPolicy;

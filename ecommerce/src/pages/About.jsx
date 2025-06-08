const About = () => {
  return (
		<div className="flex flex-col items-center justify-center ">
			<img
				src="about.jpg"
				alt="About Us"
				className=" object-cover sm:w-[75%] mt-10 sm:mt-0 "
				onError={(e) => {
					e.target.style.display = "none";
					console.log("Image failed to load");
				}}
			/>
		</div>
	);
}

export default About;
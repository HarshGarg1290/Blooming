const About = () => {
  return (
		<div className='flex flex-col items-center justify-center w-full h-[800px]'>
			<img
				src="about.jpg"
				alt="About Us"
				className="w-full h-[800px] object-cover mt-10"
				onError={(e) => {
					e.target.style.display = 'none';
					console.log('Image failed to load');
				}}
			/>
		</div>
	);
}

export default About;
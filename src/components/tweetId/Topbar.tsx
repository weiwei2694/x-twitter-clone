"use client";

import ButtonBack from "../sharing/ButtonBack";

const Topbar = () => {
	return (
		<nav className="sticky top-0 z-10 backdrop-blur bg-black/80">
			<div className="px-3 py-4">
				<div className="flex flex-row items-center gap-x-2">
					<ButtonBack />
					<h2 className="font-bold tracking-wide text-xl">Post</h2>
				</div>
			</div>
		</nav>
	);
};

export default Topbar;

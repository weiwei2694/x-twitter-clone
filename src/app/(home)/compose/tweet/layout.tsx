import Loading from "@/components/sharing/Loading";
import { ReactNode, Suspense } from "react";

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => {
	return (
		<>
			<Suspense fallback={<Loading />}>{children}</Suspense>
		</>
	);
};

export default layout;

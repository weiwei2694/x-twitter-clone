import { TransitionStartFunction } from "react";

export interface InitialProps {
	isPending: boolean;
	startTransition: TransitionStartFunction;
	toast?: any;
	path: string;
}

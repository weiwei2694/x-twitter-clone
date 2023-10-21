import { URL_REGEX } from "@/lib/tweet";
import { convertToHttps } from "@/lib/utils";
import Link from "next/link";
import { Fragment } from "react";

interface Props {
	content: string;
}

const TweetText = ({ content }: Props) => {
	const words = content.split(" ");

	return (
		<p className="whitespace-break-spaces break-all">
			{words.map((word: string) => {
				return word.match(URL_REGEX) ? (
					<Fragment key={word + new Date()}>
						<Link
							href={convertToHttps(word)?.href!}
							onClick={(e) => e.stopPropagation()}
							target="_blank"
							className="text-blue hover:underline"
						>
							{convertToHttps(word)?.title}
						</Link>{" "}
					</Fragment>
				) : (
					word + " "
				);
			})}
		</p>
	);
};

export default TweetText;

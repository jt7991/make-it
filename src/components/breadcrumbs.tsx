import { isMatch, useMatches } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";

export const Breadcrumbs = () => {
	const matches = useMatches();

	const matchesWithCrumbs = matches
		.filter((match) => isMatch(match, "loaderData.crumb"))
		.map((match) => ({
			to: match.pathname,
			label: match.loaderData!.crumb,
		}));

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{matchesWithCrumbs.map((match, index) => {
					return (
						<>
							{index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href={match.to}>{match.label}</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

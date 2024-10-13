"use strict";
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				var desc = Object.getOwnPropertyDescriptor(m, k);
				if (
					!desc ||
					("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
				) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k];
						},
					};
				}
				Object.defineProperty(o, k2, desc);
			}
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
			});
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, "default", { enumerable: true, value: v });
			}
		: function (o, v) {
				o["default"] = v;
			});
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
					__createBinding(result, mod, k);
		__setModuleDefault(result, mod);
		return result;
	};
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
					});
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y["return"]
									: op[0]
										? y["throw"] || ((t = y["return"]) && t.call(y), 0)
										: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../styles/modules/Overview.css");
var react_redux_1 = require("react-redux");
var react_query_1 = require("react-query");
var react_countup_1 = __importDefault(require("react-countup"));
var sharedFunctions_1 = require("sharedFunctions/sharedFunctions");
var overviewServices_1 = require("services/overviewServices");
var Table_1 = __importDefault(require("@mui/material/Table"));
var TableBody_1 = __importDefault(require("@mui/material/TableBody"));
var TableCell_1 = __importStar(require("@mui/material/TableCell"));
var TableContainer_1 = __importDefault(require("@mui/material/TableContainer"));
var TableHead_1 = __importDefault(require("@mui/material/TableHead"));
var TableRow_1 = __importDefault(require("@mui/material/TableRow"));
var Paper_1 = __importDefault(require("@mui/material/Paper"));
var styles_1 = require("@mui/material/styles");
var Loader_1 = __importDefault(require("sharedComponents/Loader/Loader"));
var constants_1 = require("constants/constants");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var useAdminStatus_1 = require("sharedHooks/useAdminStatus");
var StyledTableCell = (0, styles_1.styled)(TableCell_1.default)(function (_a) {
	var _b;
	var theme = _a.theme;
	return (
		(_b = {}),
		(_b["&.".concat(TableCell_1.tableCellClasses.head)] = {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
		}),
		(_b["&.".concat(TableCell_1.tableCellClasses.body)] = {
			fontSize: 14,
		}),
		_b
	);
});
var StyledTableRow = (0, styles_1.styled)(TableRow_1.default)(function (_a) {
	var theme = _a.theme;
	return {
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
		"&:last-child td, &:last-child th": {
			border: 0,
		},
	};
});
var PercentageDifference = function (_a) {
	var value = _a.value;
	var isPositive = value > 0;
	var icon = isPositive
		? free_solid_svg_icons_1.faArrowAltCircleUp
		: free_solid_svg_icons_1.faArrowAltCircleDown;
	var colorClass = isPositive ? "green-text" : "red-text";
	return (
		<span className={"".concat(colorClass, " styled-text-numbers")}>
			<react_fontawesome_1.FontAwesomeIcon icon={icon} />{" "}
			<react_countup_1.default duration={0.75} end={Math.abs(value)} />%
		</span>
	);
};
function Overview() {
	var _this = this;
	var user = (0, react_redux_1.useSelector)(function (state) {
		return state.auth.user;
	});
	var isAdmin = (0, useAdminStatus_1.useAdminStatus)();
	var fetchOverviewData = function () {
		return __awaiter(_this, void 0, void 0, function () {
			var response;
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							(0, overviewServices_1.getOverviewDataRequest)({
								selectedYear: constants_1.currentYear,
							}),
						];
					case 1:
						response = _a.sent();
						if (response.status !== 200) {
							throw new Error("Something went wrong with overview data");
						}
						return [2 /*return*/, response.body];
				}
			});
		});
	};
	var _a = (0, react_query_1.useQuery)("overviewData", fetchOverviewData, {
			enabled: !!user,
			onError: function () {
				return console.error("Something went wrong with overview data");
			},
		}),
		overviewDataIsLoading = _a.isLoading,
		overviewData = _a.data;
	if (overviewDataIsLoading || !overviewData) {
		return <Loader_1.default />;
	}
	var clients = overviewData.clients,
		activeTranslators = overviewData.activeTranslators,
		monthTotal = overviewData.monthTotal,
		monthPercentageDifference = overviewData.monthPercentageDifference,
		svadbaMonthTotal = overviewData.svadbaMonthTotal,
		svadbaPercentageDifference = overviewData.svadbaPercentageDifference,
		datingPercentageDifference = overviewData.datingPercentageDifference,
		yearTotal = overviewData.yearTotal,
		totalPayments = overviewData.totalPayments,
		totalProfit = overviewData.totalProfit,
		clientsSalary = overviewData.clientsSalary,
		paymentToScout = overviewData.paymentToScout,
		paymentToBot = overviewData.paymentToBot,
		paymentToTranslator = overviewData.paymentToTranslator;
	return (
		<div className={"main-container table-container"}>
			<TableContainer_1.default component={Paper_1.default}>
				<Table_1.default aria-label="simple table">
					<TableHead_1.default>
						<StyledTableRow>
							<StyledTableCell>Statistic's type</StyledTableCell>
							<StyledTableCell>Data</StyledTableCell>
							<StyledTableCell />
						</StyledTableRow>
					</TableHead_1.default>
					<TableBody_1.default>
						<StyledTableRow>
							<StyledTableCell>Current month</StyledTableCell>
							<StyledTableCell>
								{(0, sharedFunctions_1.getMomentUTC)().format("MMMM")}
							</StyledTableCell>
							<StyledTableCell />
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Month balance</StyledTableCell>
							<StyledTableCell>
								<span className="blue-text styled-text-numbers">
									<react_countup_1.default
										duration={0.75}
										end={monthTotal}
										prefix="$"
									/>
								</span>
							</StyledTableCell>
							<StyledTableCell>
								<PercentageDifference value={monthPercentageDifference} />
							</StyledTableCell>
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Svadba balance</StyledTableCell>
							<StyledTableCell>
								<span className="blue-text styled-text-numbers">
									<react_countup_1.default
										duration={0.75}
										end={svadbaMonthTotal}
										prefix="$"
									/>
								</span>
							</StyledTableCell>
							<StyledTableCell>
								<PercentageDifference value={svadbaPercentageDifference} />
							</StyledTableCell>
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Dating balance</StyledTableCell>
							<StyledTableCell>
								<span className="blue-text styled-text-numbers">
									<react_countup_1.default
										duration={0.75}
										end={monthTotal - svadbaMonthTotal}
										prefix="$"
									/>
								</span>
							</StyledTableCell>
							<StyledTableCell>
								<PercentageDifference value={datingPercentageDifference} />
							</StyledTableCell>
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Total clients</StyledTableCell>
							<StyledTableCell>{clients}</StyledTableCell>
							<StyledTableCell />
						</StyledTableRow>
						<StyledTableRow>
							<StyledTableCell>Active translators</StyledTableCell>
							<StyledTableCell>{activeTranslators}</StyledTableCell>
							<StyledTableCell />
						</StyledTableRow>
						{isAdmin && (
							<>
								<StyledTableRow>
									<StyledTableCell>Year's balance</StyledTableCell>
									<StyledTableCell>{"$".concat(yearTotal)}</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Salary paid</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<react_countup_1.default
												duration={0.75}
												end={totalPayments}
												prefix="$"
											/>
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Clients Salary</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<react_countup_1.default
												duration={0.75}
												end={clientsSalary}
												prefix="$"
											/>
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Payment to scout</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<react_countup_1.default
												duration={0.75}
												end={paymentToScout}
												prefix="$"
											/>
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Payment to bot</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<react_countup_1.default
												duration={0.75}
												end={paymentToBot}
												prefix="$"
											/>
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Payment to translator</StyledTableCell>
									<StyledTableCell>
										<span className="blue-text styled-text-numbers">
											<react_countup_1.default
												duration={0.75}
												end={paymentToTranslator}
												prefix="$"
											/>
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
								<StyledTableRow>
									<StyledTableCell>Total profit</StyledTableCell>
									<StyledTableCell>
										<span className="green-text styled-text-numbers">
											<react_countup_1.default
												duration={0.75}
												end={totalProfit}
												prefix="$"
											/>
										</span>
									</StyledTableCell>
									<StyledTableCell />
								</StyledTableRow>
							</>
						)}
					</TableBody_1.default>
				</Table_1.default>
			</TableContainer_1.default>
		</div>
	);
}
exports.default = Overview;

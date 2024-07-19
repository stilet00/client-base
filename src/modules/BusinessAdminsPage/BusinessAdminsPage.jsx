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
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var react_query_1 = require("react-query");
var Button_1 = __importDefault(require("@mui/material/Button"));
var SupervisorAccount_1 = __importDefault(
	require("@mui/icons-material/SupervisorAccount"),
);
var businessAdministratorsServices_1 = require("services/businessAdministratorsServices");
var Loader_1 = __importDefault(require("sharedComponents/Loader/Loader"));
var messages_1 = __importDefault(require("constants/messages"));
var useAdminStatus_1 = require("sharedHooks/useAdminStatus");
var BusinessAdminsForm_1 = __importDefault(require("./BusinessAdminsForm"));
var useModal_1 = __importDefault(require("sharedHooks/useModal"));
require("../../styles/modules/BusinessAdminsPage.css");
var BusinessAdminsPage = function (props) {
	var _a = (0, useModal_1.default)(),
		handleClose = _a.handleClose,
		handleOpen = _a.handleOpen,
		open = _a.open;
	var _b = (0, react_1.useState)(null),
		selectedAdmin = _b[0],
		setSelectedAdmin = _b[1];
	var user = (0, react_redux_1.useSelector)(function (state) {
		return state.auth.user;
	});
	var queryClient = (0, react_query_1.useQueryClient)();
	var isAdmin = (0, useAdminStatus_1.useAdminStatus)(user).isAdmin;
	var deleteMutation = (0, react_query_1.useMutation)(
		businessAdministratorsServices_1.deleteBusinessAdmin,
		{
			onSuccess: function () {
				queryClient.invalidateQueries("businessAdministratorsQuery");
			},
			onError: function () {
				console.error("Failed to delete business admin");
			},
		},
	);
	var handleDelete = function (adminId) {
		deleteMutation.mutate(adminId);
	};
	var fetchBusinessAdministrators = function () {
		return __awaiter(void 0, void 0, void 0, function () {
			var response;
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							(0, businessAdministratorsServices_1.getBusinessAdmins)({}),
						];
					case 1:
						response = _a.sent();
						if (response.status !== 200) {
							throw new Error(
								messages_1.default.somethingWentWrongWithBusinessAdmins.text,
							);
						}
						return [2 /*return*/, response.body];
				}
			});
		});
	};
	var _c = (0, react_query_1.useQuery)(
			"businessAdministratorsQuery",
			fetchBusinessAdministrators,
			{
				enabled: !!user,
				onSuccess: function (data) {
					return data;
				},
				onError: function () {
					return console.error(
						messages_1.default.somethingWentWrongWithBusinessAdmins.text,
					);
				},
			},
		),
		data = _c.data,
		isLoading = _c.isLoading;
	if (isLoading) {
		return <Loader_1.default />;
	}
	return (
		<>
			<div className="main-container scrolled-container">
				{(data === null || data === void 0 ? void 0 : data.length) === 0 ? (
					<h1>No business administrators yet</h1>
				) : (
					<ul className="business-admins-list">
						{data === null || data === void 0
							? void 0
							: data.map(function (admin) {
									return (
										<li key={admin._id} className="business-admin-item">
											<div className="admin-icon">
												<SupervisorAccount_1.default />
											</div>
											<div className="admin-info">
												<p className="admin-name">
													<strong>Name:</strong> {admin.name}
												</p>
												<p className="admin-surname">
													<strong>Surname:</strong> {admin.surname}
												</p>
												<p className="admin-email">
													<strong>Email:</strong> {admin.email}
												</p>
											</div>
											<Button_1.default
												type="button"
												onClick={function () {
													setSelectedAdmin(admin);
													handleOpen();
												}}
												variant="outlined"
												className="edit-button"
											>
												Edit
											</Button_1.default>
											<Button_1.default
												type="button"
												onClick={function () {
													return handleDelete(
														admin === null || admin === void 0
															? void 0
															: admin._id,
													);
												}}
												variant="outlined"
												className="delete-button"
											>
												Delete
											</Button_1.default>
										</li>
									);
								})}
					</ul>
				)}
			</div>
			<div className="socials button-add-container">
				<Button_1.default
					type="button"
					onClick={handleOpen}
					startIcon={<SupervisorAccount_1.default />}
					disabled={!isAdmin}
					fullWidth
				>
					Add Business Admin
				</Button_1.default>
				<BusinessAdminsForm_1.default
					handleClose={handleClose}
					formOpen={open}
					selectedAdmin={selectedAdmin}
					setSelectedAdmin={setSelectedAdmin}
				/>
			</div>
		</>
	);
};
exports.default = BusinessAdminsPage;

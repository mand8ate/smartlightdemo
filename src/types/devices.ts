// types/devices.ts
export type DevicePowerState = "ON" | "OFF";

// Base interface that all device states will extend
interface BaseDeviceState {
	power: DevicePowerState;
}

// Switch is simple - just power
export interface SwitchDeviceState extends BaseDeviceState {}

// AC has additional controls
export interface ACDeviceState extends BaseDeviceState {
	temperature: number;
	mode: "COOL" | "HEAT" | "AUTO" | "DRY";
	fanSpeed: "LOW" | "MEDIUM" | "HIGH" | "AUTO";
}

// Light has brightness and color options
export interface LightDeviceState extends BaseDeviceState {
	brightness: number;
	color?: string;
}

// TV has input and volume
export interface TVDeviceState extends BaseDeviceState {
	input?: string;
	volume: number;
}

// Union type of all possible device states
export type DeviceState =
	| SwitchDeviceState
	| ACDeviceState
	| LightDeviceState
	| TVDeviceState;

// Helper type to map DeviceType to its corresponding state
export type DeviceTypeToState = {
	SWITCHBOT_SWITCH: SwitchDeviceState;
	SWITCHBOT_IR_AC: ACDeviceState;
	SWITCHBOT_IR_LIGHT: LightDeviceState;
	SWITCHBOT_IR_TV: TVDeviceState;
};

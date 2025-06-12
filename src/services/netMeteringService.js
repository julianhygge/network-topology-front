import axiosInstance from "interceptor/AuthInterceptor"

const BASE_PATH = "/simulation"

/**
 * Fetch available simulation algorithms
 * GET /v1/simulation/algorithms
 */
export const fetchAlgorithms = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/algorithms`)
    return response.data
  } catch (error) {
    console.error("Error fetching algorithms:", error)
    throw error
  }
}

/**
 * Create a new simulation run
 * POST /v1/simulation/simulations-runs
 * body: { topology_root_node_id, simulation_algorithm_type_id }
 */
export const createSimulationRun = async ({simulation_container_id, description,topologyRootNodeId, algorithmTypeId ,localityId}) => {
  try {
    const payload = {
      description:description,
      simulation_container_id:simulation_container_id,
      topology_root_node_id: topologyRootNodeId,
      simulation_algorithm_type_id: algorithmTypeId,
      locality_id: localityId,
    }
    const response = await axiosInstance.post(`${BASE_PATH}/simulations-runs`, payload)
    return response.data
  } catch (error) {
    console.error("Error creating simulation run:", error)
    throw error
  }
}

/**
 * Fetch active net metering policies
 * GET /v1/simulation/net-metering/policies
 */
export const fetchNetMeteringPolicies = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/net-metering/policies`)
    return response.data
  } catch (error) {
    console.error("Error fetching net metering policies:", error)
    throw error
  }
}

/**
 * Select and link a policy to the simulation run
 * POST /v1/simulation/selected/policy
 * body: { simulation_run_id, net_metering_policy_type_id }
 */
export const selectNetMeteringPolicy = async ({ simulationRunId, policyTypeId }) => {

  try {
    const payload = {
      simulation_run_id: simulationRunId,
      net_metering_policy_type_id: policyTypeId,
    }
    console.log(payload);
    const response = await axiosInstance.post(`${BASE_PATH}/selected/policy`, payload)
    return response.data
  } catch (error) {
    console.error("Error selecting net metering policy:", error)
    throw error
  }
}

/**
 * Update billing cycle on a simulation run
 * PUT /v1/simulation/{simulation_run_id}/simulations-runs
 * body: { billing_cycle_month, billing_cycle_year }
 */
export const updateBillingCycle = async ({ simulationRunId, month, year }) => {
  try {
    const payload = {
      billing_cycle_month: month,
      billing_cycle_year: year,
    }
    const response = await axiosInstance.put(
      `${BASE_PATH}/${simulationRunId}/simulations-runs`,
      payload
    )
    return response.data
  } catch (error) {
    console.error("Error updating billing cycle:", error)
    throw error
  }
}

/**
 * Submit net metering policy parameters
 * POST /v1/simulation/policy/net-metering
 * body: { simulation_run_id, retail_price_per_kwh, fixed_charge_tariff_rate_per_kw }
 */
export const generateNetMeteringPolicyBill = async ({ simulationRunId, retailPrice, fixedChargeRate }) => {
  try {
    const payload = {
      simulation_run_id: simulationRunId,
      retail_price_per_kwh: retailPrice,
      fixed_charge_tariff_rate_per_kw: fixedChargeRate,
    }
    const response = await axiosInstance.post(
      `${BASE_PATH}/policy/net-metering`,
      payload
    )
    return response.data
  } catch (error) {
    console.error("Error posting net metering policy params:", error)
    throw error
  }
}

/**
 * Submit gross metering policy parameters
 * POST /v1/simulation/policy/net-metering
 * body: { simulation_run_id, retail_price_per_kwh, export_wholesale_price_per_kwh, fixed_charge_tariff_rate_per_kw }
 */
export const generateGrossMeteringPolicyBill = async ({ simulationRunId, retailPrice, wholesalePrice, fixedChargeRate }) => {
  try {
    const payload = {
      simulation_run_id: simulationRunId,
      retail_price_per_kwh: retailPrice,
      export_wholesale_price_per_kwh: wholesalePrice,
      fixed_charge_tariff_rate_per_kw: fixedChargeRate,
    }
    const response = await axiosInstance.post(
      `${BASE_PATH}/policy/net-metering`,
      payload
    )
    return response.data
  } catch (error) {
    console.error("Error posting net metering policy params:", error)
    throw error
  }
}

export const generateTouMeteringPolicyBill = async ({ simulationRunId, startTime, endTime, retailPrice, wholesalePrice}) => {
  try{
    const payload = {
      simulation_run_id: simulationRunId,
      start_time: startTime,
      end_time: endTime,
      import_retail_rate_per_kwh: retailPrice,
      export_wholesale_rate_per_kwh: wholesalePrice,
    }
    const response = await axiosInstance.post(
      `${BASE_PATH}/policy/tou`,
      payload
    )
    return response.data
  }catch(error){
    console.error("Error generating TOU rate metering bill:", error)
    throw error
  }
}

/**
 * Get Selected Simulation Policy
 * GET /v1/simulation//${simulation_run_id}/selected/policy
 * body: { simulation_run_id }
 */
export const fetchSelectedPolicy = async (simulation_run_id) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_PATH}/${simulation_run_id}/selected/policy`
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching selected policy:", error);
    throw error;
  }
};

/**
 * Fetch energy summary (total imported/exported) for a given node/time‐range.
 * GET /v1/simulation/nodes/{node_id}/energy-summary?start_datetime=...&end_datetime=...
 */
export const fetchEnergySummary = async ({ nodeId, startDatetime, endDatetime }) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_PATH}/nodes/${nodeId}/energy-summary`,
      {
        params: {
          start_datetime: startDatetime,
          end_datetime:   endDatetime
        }
      }
    );
    // response.data should contain { total_imported_kwh: number, total_exported_kwh: number }
    return response.data;
  } catch (error) {
    console.error('Error fetching energy summary:', error);
    throw error;
  }
};
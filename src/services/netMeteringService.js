import axiosInstance from "interceptor/AuthInterceptor";

const BASE_PATH = "/simulation";

/**
 * Fetch available simulation algorithms
 * GET /v1/simulation/algorithms
 */
export const fetchAlgorithms = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/algorithms`);
    return response.data;
  } catch (error) {
    console.error("Error fetching algorithms:", error);
    throw error;
  }
};

/**
 * Create a new simulation run
 * POST /v1/simulation/simulations-runs
 * body: { topology_root_node_id, simulation_algorithm_type_id }
 */
export const createSimulationRun = async ({
  simulation_container_id,
  description,
  topologyRootNodeId,
  algorithmTypeId,
  localityId,
}) => {
  try {
    const payload = {
      description: description,
      simulation_container_id: simulation_container_id,
      topology_root_node_id: topologyRootNodeId,
      simulation_algorithm_type_id: algorithmTypeId,
      locality_id: localityId,
    };
    const response = await axiosInstance.post(
      `${BASE_PATH}/simulations-runs`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating simulation run:", error);
    throw error;
  }
};

/**
 * Fetch active net metering policies
 * GET /v1/simulation/net-metering/policies
 */
export const fetchNetMeteringPolicies = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_PATH}/net-metering/policies`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching net metering policies:", error);
    throw error;
  }
};

/**
 * Select and link a policy to the simulation run
 * POST /v1/simulation/selected/policy
 * body: { simulation_run_id, net_metering_policy_type_id }
 */
export const selectNetMeteringPolicy = async ({
  simulationRunId,
  policyTypeId,
}) => {
  try {
    const payload = {
      simulation_run_id: simulationRunId,
      net_metering_policy_type_id: policyTypeId,
    };
    console.log(payload);
    const response = await axiosInstance.post(
      `${BASE_PATH}/selected/policy`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error selecting net metering policy:", error);
    throw error;
  }
};

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
    };
    const response = await axiosInstance.put(
      `${BASE_PATH}/${simulationRunId}/simulations-runs`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating billing cycle:", error);
    throw error;
  }
};

/**
 * Submit net metering policy parameters
 * POST /v1/simulation/policy/net-metering
 * body: { simulation_run_id, retail_price_per_kwh, fixed_charge_tariff_rate_per_kw }
 */
export const generateNetMeteringPolicyBill = async ({
  simulationRunId,
  retailPrice,
  fixedChargeRate,
}) => {
  try {
    const payload = {
      simulation_run_id: simulationRunId,
      retail_price_per_kwh: retailPrice,
      fixed_charge_tariff_rate_per_kw: fixedChargeRate,
    };
    const response = await axiosInstance.post(
      `${BASE_PATH}/policy/net-metering`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error posting net metering policy params:", error);
    throw error;
  }
};

/**
 * Submit gross metering policy parameters
 * POST /v1/simulation/policy/net-metering
 * body: { simulation_run_id, retail_price_per_kwh, export_wholesale_price_per_kwh, fixed_charge_tariff_rate_per_kw }
 */
export const generateGrossMeteringPolicyBill = async ({
  simulationRunId,
  retailPrice,
  wholesalePrice,
  fixedChargeRate,
}) => {
  try {
    const payload = {
      simulation_run_id: simulationRunId,
      import_retail_price_per_kwh: retailPrice,
      export_wholesale_price_per_kwh: wholesalePrice,
      fixed_charge_tariff_rate_per_kw: fixedChargeRate,
    };
    console.log(payload);
    const response = await axiosInstance.post(
      `${BASE_PATH}/policy/gross-metering`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error posting net metering policy params:", error);
    throw error;
  }
};

export const generateTouMeteringPolicyBill = async ({
  simulationRunId,
  timePeriodLabel,
  startTime,
  endTime,
  retailPrice,
  wholesalePrice,
}) => {
  try {
    const payload = {
      simulation_run_id: simulationRunId,
      time_period_label: timePeriodLabel,
      start_time: startTime,
      end_time: endTime,
      import_retail_rate_per_kwh: retailPrice,
      export_wholesale_rate_per_kwh: wholesalePrice,
    };
    const response = await axiosInstance.post(
      `${BASE_PATH}/policy/tou`,
      payload
    );
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error generating TOU rate metering bill:", error);
    throw error;
  }
};

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
export const fetchEnergySummary = async ({
  nodeId,
  startDatetime,
  endDatetime,
}) => {
  try {
    console.log(nodeId);
    const response = await axiosInstance.get(
      `${BASE_PATH}/houses/${nodeId}/energy-summary`,
      {
        params: {
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        },
      }
    );
    // response.data should contain { total_imported_kwh: number, total_exported_kwh: number }
    return response.data;
  } catch (error) {
    console.error("Error fetching energy summary:", error);
    throw error;
  }
};

export const fetchSimulationContainers = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/containers`);

    return response.data;
  } catch (error) {
    console.error("Error fetching simulation containers:", error);

    throw error;
  }
};

/**
 * Create a new simulation container
 * POST /v1/simulation/container
 */
export const createSimulationContainer = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_PATH}/container`,
      payload
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating simulation container:", error);
    throw error;
  }
};

/**
 * Fetch all simulation runs (versions) for a given container.
 * GET /v1/simulation/{container_id}/simulation-runs
 */
export const fetchSimulationRunsByContainer = async (containerId) => {
  try {
    console.log(containerId);
    const response = await axiosInstance.get(
      `${BASE_PATH}/${containerId}/simulations-runs`
    );
    // response.data is expected an array of run objects
    return response.data;
  } catch (error) {
    console.error("Error fetching simulation runs:", error);
    throw error;
  }
};

//For creating version

export const createVersion = async ({
  simulation_container_id,
  description,
  run_name,
}) => {
  try {
    const payload = {
      simulation_container_id: simulation_container_id,
      run_name: run_name,
      description: description,
    };
    const response = await axiosInstance.post(
      `${BASE_PATH}/simulations-runs`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating simulation run:", error);
    throw error;
  }
};

export const updateRunFromVersion = async ({
  simulation_run_id,
  topology_root_node_id,
  simulation_algorithm_type_id,
}) => {
  try {
    const payload = {
      topology_root_node_id,
      simulation_algorithm_type_id,
    };

    const response = await axiosInstance.put(
      `${BASE_PATH}/${simulation_run_id}/simulations-runs`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("Error updating simulation run from version:", error);
    throw error;
  }
};

export const updateNetMeteringPolicy = async ({
  simulation_run_id,
  net_metering_policy_type_id,
}) => {
  try {
    const payload = { net_metering_policy_type_id };
    const res = await axiosInstance.put(
      `${BASE_PATH}/${simulation_run_id}/policies`,
      payload
    );
    return res.data;
  } catch (err) {
    console.error("Error updating selected policy:", err);
    throw err;
  }
};

export const updateNetMeteringBill = async ({
  simulation_run_id,
  retail_price_per_kwh,
  fixed_charge_tariff_rate_per_kw,
}) => {
  try {
    const payload = { retail_price_per_kwh, fixed_charge_tariff_rate_per_kw };
    const res = await axiosInstance.put(
      `${BASE_PATH}/${simulation_run_id}/net-metering`,
      payload
    );
    return res.data;
  } catch (err) {
    console.error("Error updating net metering policy:", err);
    throw err;
  }
};

export const fetchNetMeteringPolicy = async (simulation_run_id) => {
  try {
    const res = await axiosInstance.get(
      `${BASE_PATH}/${simulation_run_id}/policy/net-metering`
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    console.error("Error fetching net metering policy:", err);
    throw err;
  }
};

export const fetchGrossMeteringPolicy = async (simulationRunId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_PATH}/${simulationRunId}/policy/gross-metering`
    );
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // no existing policy
      return null;
    }
    console.error("Error fetching gross metering policy:", err);
    throw err;
  }
};

export const updateGrossMeteringPolicy = async ({
  simulation_run_id,
  import_retail_price_per_kwh,
  export_wholesale_price_per_kwh,
  fixed_charge_tariff_rate_per_kw,
}) => {
  try {
    const payload = {
      import_retail_price_per_kwh,
      export_wholesale_price_per_kwh,
      fixed_charge_tariff_rate_per_kw,
    };
    const response = await axiosInstance.put(
      `${BASE_PATH}/${simulation_run_id}/gross-metering`,
      payload
    );
    return response.data;
  } catch (err) {
    console.error("Error updating gross metering policy:", err);
    throw err;
  }
};

export const fetchTouPolicies = async (simulationRunId) => {
  try {
    const res = await axiosInstance.get(
      `${BASE_PATH}/${simulationRunId}/policy/tou`
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return [];
    }
    console.error("Error fetching TOU policies:", err);
    throw err;
  }
};

export const updateTouPolicy = async ({
  touId,
  timePeriodLabel,
  startTime,
  endTime,
  importRetailRatePerKwh,
  exportWholesaleRatePerKwh,
}) => {
  try {
    const payload = {
      time_period_label: timePeriodLabel,
      start_time: startTime,
      end_time: endTime,
      import_retail_rate_per_kwh: importRetailRatePerKwh,
      export_wholesale_rate_per_kwh: exportWholesaleRatePerKwh,
    };
    const res = await axiosInstance.put(`${BASE_PATH}/${touId}/tou/`, payload);
    return res.data;
  } catch (err) {
    console.error("Error updating TOU policy row:", err);
    throw err;
  }
};

export const triggerBillCalculation = async (simulationRunId) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_PATH}/simulation-runs/${simulationRunId}/calculate-bills`
    );
    return response.data;
  } catch (error) {
    console.error("Error triggering bill calculation:", error);
    throw error;
  }
};

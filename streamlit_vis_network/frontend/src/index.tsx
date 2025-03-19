import { Streamlit, RenderData } from "streamlit-component-lib";
import { Edge, IdType, Network, Node as visNode } from "vis-network";

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  // Get the RenderData from the event
  // RenderData.args is the JSON dictionary of arguments sent from the
  // Python script.
  const data = (event as CustomEvent<RenderData>).detail;
  var container = document.getElementById("vis-network-container")!;
  container.style.height = data.args["height"];
  container.style.width = data.args["width"];
  // create an array with nodes
  let nodesArray: visNode[] = data.args["nodes"];
  // create an array with edges
  let edgesArray: Edge[] = data.args["edges"];
  // nodes and edges are passed together
  var node_edge_data = {
    nodes: nodesArray,
    edges: edgesArray,
  };
  var network = new Network(container, node_edge_data, data.args["options"]);
  let component_value: [any, any, any];
  // If a node is selected, pass the selected node id back to Streamlit
  network.on("selectNode", (params: any) => {
    if (params.nodes.length > 0) {
      const selectedNodeId = params.nodes[0];
      network.focus(selectedNodeId, {
        scale: 1.5,
        animation: {
          duration: 500,
          easingFunction: "easeInOutQuad",
        },
      });
      let edges: Array<any> = [];
      params.edges.forEach((edgeId: IdType) => {
        edges.push(network.getConnectedNodes(edgeId));
      });
      component_value = [params.nodes, edges, network.getPositions()];
      Streamlit.setComponentValue(component_value);
    }
  });
  network.on("deselectNode", (params: any) => {
    let edges: Array<any> = [];
    params.edges.forEach((edgeId: IdType) => {
      edges.push(network.getConnectedNodes(edgeId));
    });
    component_value = [params.nodes, edges, network.getPositions()];
    Streamlit.setComponentValue(component_value); // Pass null when node is deselected
  });
  network.on("selectEdge", (params: any) => {
    if (params.edges.length > 0) {
      Streamlit.setComponentValue(null);
      const selectedEdgeId = params.edges[0];
      let edges: Array<any> = [network.getConnectedNodes(selectedEdgeId)];
      component_value = [params.nodes, edges, network.getPositions()];
      Streamlit.setComponentValue(component_value);
    }
  });
  network.on("deselectEdge", (params: any) => {
    let edges: Array<any> = [];
    params.edges.forEach((edgeId: IdType) => {
      edges.push(network.getConnectedNodes(edgeId));
    });
    component_value = [params.nodes, edges, network.getPositions()];
    Streamlit.setComponentValue(component_value); // Pass null when edge is deselected
  });
  network.redraw();
  Streamlit.setFrameHeight();
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady();

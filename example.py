import select
import streamlit as st
from streamlit_vis_network import streamlit_vis_network


nodes = [{'id': 1, "label": "node 1"}, {'id': 2, "label": "node 2"}]
edges = [{"from": 1, "to": 2, "label": "edge", "id": "edge1"}]

selection = streamlit_vis_network(nodes, edges, height=500, width=500)
if selection:
    selected_nodes, selected_edges = selection
    if selected_nodes:
        st.write(f"Selected node: {selected_nodes[0]}")
    elif selected_edges:
        st.write(f"Selected edge: {selected_edges[0]}")
    else:
        st.write("No current selection.")
else:
    st.write("No current selection.")

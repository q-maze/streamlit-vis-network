import streamlit as st
from streamlit_vis_network import streamlit_vis_network


nodes = [{'id': 1, "label": "node 1"}, {'id': 2, "label": "node 2"}]
edges = [{"from": 1, "to": 2, "label": "edge"}]

a = streamlit_vis_network(nodes, edges, height=None, width=None)
st.write(f"Selected node: {a}")
